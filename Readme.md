
# 📌 Walmart Green Mode

**Walmart Green Mode** is an AI-powered sustainability layer integrated into the Walmart shopping interface. Built with purpose, it empowers users to make environmentally conscious choices—right from product selection to checkout.

Designed for **Walmart Sparkathon 2025** under the theme *“Retail with Purpose”*, this project blends data, design, and environmental action to drive better shopping decisions.

---

## 📝 Description

Customers today care about sustainability—but lack tools to act on it while shopping. **Walmart Green Mode** solves this by:

- Highlighting eco-friendly products (refurbished, plastic-free, eco-certified)
- Displaying real-time carbon footprints
- Rewarding users with **eco-points** for making greener choices
- Providing actionable impact stats via a personal **Eco Dashboard**

🛒 Built using an open-source Walmart UI clone by [@harshita0802goswami](https://github.com/harshita0802goswami), the platform is extended with new features, AI logic, and sustainability APIs to bring responsible retail to life.

---

## ✅ Features

- 🌿 **Green Mode Toggle** – Enables the eco-aware experience with one click  
- 🟢 **Hover Card Eco Insights** – Instantly view carbon footprint & eco-points on product hover  
- 🧠 **Smart Filters** – Filter products by eco-rank  
- 📦 **Eco Cart Summary** – View total emissions and packaging impact before checkout  
- 🚚 **Eco Checkout Options** – Choose green delivery, group orders, and support tree-planting  
- 📊 **Eco Dashboard** – Track CO₂ saved, trees planted, and compete on a green leaderboard  

---

## 🧑‍💻 Tech Stack

### 🔷 Frontend
- HTML  
- CSS  
- JavaScript  
- Tailwind CSS  

### 🔶 Backend / AI Layer
- Python (FastAPI)  
- Uvicorn (ASGI server)  
- Custom carbon scoring & recommendation scripts  

### 🟡 Database
- Local JSON / in-memory store (can be upgraded to MongoDB or Firebase)  

### 🌐 APIs Used
- **Walmart Product API** – Fetch product metadata  
- **Carbon Footprint Estimator API** – Compute emission values  
- **Tree Donation API** – Enable real-world green action  

> **Base Template Forked From:**  
> [@harshita0802goswami/Walmart-Clone](https://github.com/harshita0802goswami/Walmart-Clone)

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally:

### 🚀 Frontend
```bash
git clone https://github.com/Shivam-Kumar-Verma/walmart-green-mode.git
cd walmart-green-mode/Walmart
open econew.html
```

### 🧠 Backend (Optional - for AI/ML features)
```bash
cd Green-AI
pip install -r requirements.txt
uvicorn main:app --reload
```

> The Python backend powers product sorting, carbon scoring, and recommendation logic.

---

## 📸 Demo

> 🎥 **Insert preview GIF or screenshot** of the Green Mode UI in action  
> 🌐 **Live Demo (if hosted):** [[Click Here](https://youtu.be/FF7CQJiA38Q?si=G4Eh4laS7rLjMdxG)]  

---

## 👥 Contributors

Made with 💚 by:  
- [Swarnava Banerjee](https://github.com/Swar-16)
- [Shivam Kumar Verma](https://github.com/Shivam-Kumar-Verma)  
- [Ayush Kumar](https://github.com/kumarayush0104)
- [Ayush Keshri](https://github.com/AyushKeshri4) 

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- **Walmart Sparkathon 2025** – For driving purpose-led innovation  
- **[@harshita0802goswami](https://github.com/harshita0802goswami)** – Original UI clone base  
- **Open-Source APIs** – Carbon calculation, product data, and tree-planting integrations  
- **Inspiration** – Walmart’s goal of achieving zero emissions by 2040  
