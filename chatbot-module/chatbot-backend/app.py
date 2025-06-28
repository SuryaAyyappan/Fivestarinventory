''' with database connection
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# ✅ Update with your actual DB credentials
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1234sundaram",
    database="chatbot"
)
cursor = db.cursor(dictionary=True)

@app.route('/chat', methods=['POST'])
def chat():
    user_msg = request.json.get("message", "").lower()

    # ✅ 1. Product Details on Demand
    if "stock" in user_msg or "available" in user_msg or "price" in user_msg:
        product = extract_product_name(user_msg)
        if product:
            cursor.execute("SELECT * FROM products WHERE name LIKE %s", ("%" + product + "%",))
            result = cursor.fetchone()
            if result:
                return jsonify({"reply": f"""
Product: {result['name']}
Stock: {result['stock']} units
Price: ₹{result['price']}
Expiry: {result['expiry_date']}
Location: {result.get('location', 'N/A')}
"""})
            else:
                return jsonify({"reply": "Product not found in inventory."})

    # ✅ 2. Upcoming Expiry Alerts
    elif "expire" in user_msg or "expiring soon" in user_msg:
        today = datetime.today().date()
        soon = today + timedelta(days=3)
        cursor.execute("SELECT name, expiry_date FROM products WHERE expiry_date BETWEEN %s AND %s", (today, soon))
        items = cursor.fetchall()
        if items:
            reply = "🕒 Products expiring soon:\n" + "\n".join([f"- {i['name']} (Exp: {i['expiry_date']})" for i in items])
        else:
            reply = "No products are expiring in the next 3 days."
        return jsonify({"reply": reply})

    # ✅ 3. Low Stock Checker
    elif "low stock" in user_msg or "below threshold" in user_msg:
        cursor.execute("SELECT name, stock FROM products WHERE stock < 10")
        items = cursor.fetchall()
        if items:
            reply = "⚠️ Low Stock Items:\n" + "\n".join([f"- {i['name']}: {i['stock']} units" for i in items])
        else:
            reply = "All items are above the minimum stock level."
        return jsonify({"reply": reply})

    # ✅ 4. Damaged Product List
    elif "damaged" in user_msg:
        cursor.execute("SELECT name FROM products WHERE status = 'damaged'")
        items = cursor.fetchall()
        if items:
            reply = "💥 Damaged Items:\n" + "\n".join([f"- {i['name']}" for i in items])
        else:
            reply = "No damaged products found."
        return jsonify({"reply": reply})

    # ✅ 5. Invoice Info
    elif "invoice" in user_msg:
        product = extract_product_name(user_msg)
        if product:
            cursor.execute("SELECT * FROM invoices WHERE product_name LIKE %s ORDER BY created_at DESC LIMIT 1", ("%" + product + "%",))
            invoice = cursor.fetchone()
            if invoice:
                return jsonify({"reply": f"""
📄 Last Invoice for {product}:
- Invoice No: {invoice['invoice_no']}
- Amount: ₹{invoice['amount']}
- Date: {invoice['created_at']}
- Download: {invoice['pdf_link']}
"""})
            else:
                return jsonify({"reply": "No invoice found for that product."})

    # ✅ 6. Newly Arrived Items
    elif "new" in user_msg or "arrived" in user_msg:
        one_week_ago = datetime.today() - timedelta(days=7)
        cursor.execute("SELECT name, arrival_date FROM products WHERE arrival_date >= %s", (one_week_ago,))
        items = cursor.fetchall()
        if items:
            reply = "🆕 Newly Arrived Items:\n" + "\n".join([f"- {i['name']} (Arrived: {i['arrival_date']})" for i in items])
        else:
            reply = "No new products added this week."
        return jsonify({"reply": reply})

    # ✅ 7. Category-wise Stock Summary
    elif "category" in user_msg or "how many" in user_msg:
        category = extract_product_name(user_msg)
        if category:
            cursor.execute("SELECT COUNT(*) as count FROM products WHERE category LIKE %s", ("%" + category + "%",))
            result = cursor.fetchone()
            return jsonify({"reply": f"There are {result['count']} products in category '{category}'."})
        else:
            return jsonify({"reply": "Please mention a category name like dairy, tech, etc."})

    # ✅ 8. Last Updated Date
    elif "last updated" in user_msg:
        product = extract_product_name(user_msg)
        if product:
            cursor.execute("SELECT name, last_updated FROM products WHERE name LIKE %s", ("%" + product + "%",))
            result = cursor.fetchone()
            if result:
                return jsonify({"reply": f"{result['name']} was last updated on {result['last_updated']}"})
            else:
                return jsonify({"reply": "Product not found."})

    # ✅ 9. General Help
    elif "help" in user_msg or "what can you do" in user_msg:
        return jsonify({"reply": """
💬 You can ask me:
• Stock of a product (e.g. "Stock of Milk")
• Products expiring soon
• Low stock items
• Damaged items
• Last invoice for a product
• Newly arrived items
• Category-wise count (e.g. "How many dairy items?")
• Last updated date of a product
"""})

    else:
        return jsonify({"reply": "Sorry, I didn't understand. Try asking about stock, expiry, damage, invoice, or category."})

# Extract product or category name from question
def extract_product_name(text):
    words = text.lower().split()
    keywords = ['of', 'for', 'about']
    for i, word in enumerate(words):
        if word in keywords and i + 1 < len(words):
            return words[i + 1]
    return None

if __name__ == '__main__':
    app.run(debug=True)
*/
'''

'''without db below'''
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import re
app = Flask(__name__)
CORS(app)

# Dummy data to simulate DB
products = [
    {
        "name": "Milk",
        "stock": 15,
        "price": 25,
        "expiry_date": "2025-06-30",
        "location": "shelf",
        "status": "ok",
        "arrival_date": "2025-06-25",
        "last_updated": "2025-06-28",
        "category": "dairy"
    },
    {
        "name": "Rice",
        "stock": 4,
        "price": 55,
        "expiry_date": "2025-07-01",
        "location": "warehouse",
        "status": "damaged",
        "arrival_date": "2025-06-20",
        "last_updated": "2025-06-27",
        "category": "grain"
    }
]

invoices = [
    {
        "invoice_no": "INV123",
        "product_name": "Rice",
        "amount": 550,
        "created_at": "2025-06-25",
        "pdf_link": "http://example.com/invoice123.pdf"
    }
]

@app.route('/chat', methods=['POST'])
def chat():
    user_msg = request.json.get("message", "").lower()

    if "stock" in user_msg or "available" in user_msg or "price" in user_msg:
        product = extract_name(user_msg)
        for p in products:
            if product and product.lower() in p["name"].lower():
                return jsonify({"reply": f"""
Product: {p['name']}
Stock: {p['stock']} units
Price: ₹{p['price']}
Expiry: {p['expiry_date']}
Location: {p['location']}
"""})
        return jsonify({"reply": "Product not found."})

    elif "expire" in user_msg:
        today = datetime.today().date()
        soon = today + timedelta(days=3)
        expiring = [p for p in products if datetime.strptime(p["expiry_date"], "%Y-%m-%d").date() <= soon]
        if expiring:
            reply = "Expiring Soon:\n" + "\n".join([f"- {p['name']} (Exp: {p['expiry_date']})" for p in expiring])
        else:
            reply = "No products are expiring soon."
        return jsonify({"reply": reply})

    elif "low stock" in user_msg or "below threshold" in user_msg:
        low = [p for p in products if p["stock"] < 10]
        if low:
            reply = "Low Stock Items:\n" + "\n".join([f"- {p['name']} ({p['stock']} units)" for p in low])
        else:
            reply = "All items have enough stock."
        return jsonify({"reply": reply})

    elif "damaged" in user_msg:
        damaged = [p for p in products if p["status"] == "damaged"]
        if damaged:
            reply = "Damaged Items:\n" + "\n".join([f"- {p['name']}" for p in damaged])
        else:
            reply = "No damaged items found."
        return jsonify({"reply": reply})

    elif "invoice" in user_msg:
        product = extract_name(user_msg)
        for i in invoices:
            if product and product.lower() in i["product_name"].lower():
                return jsonify({"reply": f"""
Invoice for {product}:
- Invoice No: {i['invoice_no']}
- Amount: ₹{i['amount']}
- Date: {i['created_at']}
- PDF: {i['pdf_link']}
"""})
        return jsonify({"reply": "No invoice found for that product."})

    elif "arrived" in user_msg:
        week_ago = datetime.today().date() - timedelta(days=7)
        new_items = [p for p in products if datetime.strptime(p["arrival_date"], "%Y-%m-%d").date() >= week_ago]
        if new_items:
            reply = "New Arrivals:\n" + "\n".join([f"- {p['name']} (Arrived: {p['arrival_date']})" for p in new_items])
        else:
            reply = "No new products this week."
        return jsonify({"reply": reply})

    elif "how many" in user_msg or "category" in user_msg:
        category = extract_name(user_msg)
        count = sum(1 for p in products if category and category.lower() in p["category"].lower())
        return jsonify({"reply": f"There are {count} items in '{category}' category."})

    elif "last updated" in user_msg:
        product = extract_name(user_msg)
        for p in products:
            if product and product.lower() in p["name"].lower():
                return jsonify({"reply": f"{p['name']} was last updated on {p['last_updated']}."})
        return jsonify({"reply": "Product not found."})

    elif "help" in user_msg or "what can you do" in user_msg:
        return jsonify({"reply": """
You can ask:
- Stock of a product
- Products expiring soon
- Low stock items
- Damaged items
- Last invoice of a product
- Newly arrived products
- Category-wise summary
- Last updated date
"""})

    else:
        return jsonify({"reply": "Sorry, I didn’t understand. Try asking about stock, expiry, invoice, or damage."})



def extract_name(text):
    # Remove punctuation and extract last word after "of", "for", "about"
    words = re.sub(r'[^\w\s]', '', text).lower().split()
    for i in range(len(words)):
        if words[i] in ["of", "for", "about"] and i + 1 < len(words):
            return words[i + 1]
    return None

if __name__ == '__main__':
    app.run(debug=True)
