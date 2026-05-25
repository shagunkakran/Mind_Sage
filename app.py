# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pandas as pd
# from sklearn.tree import DecisionTreeClassifier
# import numpy as np

# app = Flask(__name__)
# CORS(app)

# # Data load aur model train karo
# df = pd.read_csv('characters.csv')
# X = df.drop('Name', axis=1)
# y = df['Name']

# model = DecisionTreeClassifier(criterion='entropy')
# model.fit(X, y)

# @app.route('/ask', methods=['POST'])
# def ask():
#     data = request.json
#     answered_so_far = data.get('answers', {}) # e.g. {"isReal": 1, "isMale": 1}
    
#     # 1. Characters ko filter karo jo answers match karte hain
#     filtered_df = df.copy()
#     for feature, value in answered_so_far.items():
#         filtered_df = filtered_df[filtered_df[feature] == value]
    
#     # 2. Check karo kya hum result tak pahunch gaye?
#     remaining_count = len(filtered_df)
    
#     if remaining_count == 1:
#         return jsonify({
#             "status": "result",
#             "name": filtered_df.iloc[0]['Name']
#         })
#     elif remaining_count == 0:
#         return jsonify({"status": "fail", "message": "I give up! Who is it?"})

#     # 3. Agla best question dhundo jo list mein na ho
#     all_features = list(X.columns)
#     remaining_features = [f for f in all_features if f not in answered_so_far]
    
#     if not remaining_features:
#         # Agar saare sawaal khatam ho jayein toh jo sabse upar hai wahi guess karlo
#         return jsonify({"status": "result", "name": filtered_df.iloc[0]['Name']})

#     # Simple logic: Agla available feature pucho
#     next_q = remaining_features[0]
    
#     return jsonify({
#         "status": "question",
#         "question_key": next_q,
#         "question_text": f"Is your character {next_q.replace('is', '').replace('has', '')}?"
#     })

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)



# # ... purana code (imports, model training) ...

# @app.route('/ask', methods=['POST'])
# def ask():
#     # ... ask ka saara code (4 spaces indented) ...
#     return jsonify(...)

# # YAHAN SE NAYA STEP 4 WALA CODE SHURU HOGA
# @app.route('/learn', methods=['POST',['OPTIONS']])
# def learn():
#     data = request.json
#     new_name = data.get('name')
#     answers = data.get('answers')

#     if not new_name or not answers:
#         return jsonify({"status": "error", "message": "Data missing!"})

#     # CSV mein naya character likhna
#     new_row = {"Name": new_name}
#     new_row.update(answers)
    
#     new_df = pd.DataFrame([new_row])
#     # Mode 'a' matlab Append (niche add karna)
#     new_df.to_csv('characters.csv', mode='a', header=False, index=False)
    
#     global df
#     df = pd.read_csv('characters.csv')
    
#     return jsonify({"status": "success", "message": f"I learned {new_name}!"})

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)    







from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import csv
import os

app = Flask(__name__)

# MASTER CORS FIX: Sab kuch allow kar do!
CORS(app, resources={r"/*": {
    "origins": "*",
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type"]
}})

# Data load logic
CSV_FILE = 'characters.csv'
df = pd.read_csv(CSV_FILE)
X = df.drop('Name', axis=1)
y = df['Name']

model = DecisionTreeClassifier(criterion='entropy')
model.fit(X, y)

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    answered_so_far = data.get('answers', {})
    filtered_df = df.copy()
    for feature, value in answered_so_far.items():
        filtered_df = filtered_df[filtered_df[feature] == value]
    
    if len(filtered_df) == 0:
        return jsonify({"status": "fail"})
    if len(filtered_df) == 1:
        return jsonify({"status": "result", "name": filtered_df.iloc[0]['Name']})
    
    remaining_features = [f for f in X.columns if f not in answered_so_far]
    if not remaining_features:
        return jsonify({"status": "result", "name": filtered_df.iloc[0]['Name']})

    next_q = remaining_features[0]
    return jsonify({
        "status": "question",
        "question_key": next_q,
        "question_text": f"Is your character {next_q.replace('is', '').replace('has', '')}?"
    })

@app.route('/learn', methods=['POST', 'OPTIONS'])
def learn():
    # OPTIONS request handling for Preflight
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
        
    try:
        data = request.get_json()
        new_name = data.get('name')
        answers = data.get('answers')

        # CSV Columns ke order mein data prepare karo
        new_row = [new_name]
        for col in X.columns:
            new_row.append(answers.get(col, 0))

        # Append to CSV
        with open(CSV_FILE, 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(new_row)
        
        # Global DF update
        global df, model
        df = pd.read_csv(CSV_FILE)
        X = df.drop('Name', axis=1)
        y = df['Name']
        model.fit(X, y)
        # global df, model
        # df = pd.read_csv(CSV_FILE)
        # model.fit(df.drop('Name', axis=1), df['Name'])
        
        return jsonify({"status": "success"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
