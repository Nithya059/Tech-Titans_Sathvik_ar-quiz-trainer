# 📱 AR Quiz Trainer  
### *Scan. Learn. Score.*

AR Quiz Trainer is an interactive learning tool that allows students to **scan real lab objects** and instantly **unlock AI-generated quizzes** based on the scanned item. The system uses **on-device machine learning (TensorFlow.js)** to detect objects and trigger context-based questions.

It improves lab learning, safety awareness, and concept visualization through **gamified quizzes**, **instant scoring**, and **answer explanations**.

---

## 🚀 Features

### 🔍 1. Object Detection (No Backend Needed)
- Uses **TensorFlow.js MobileNet** model  
- Works on laptop and mobile browsers  
- Can detect **any lab object provided by judges**  
- If detection fails → shows a **“Object not recognized”** message  

### 🧪 2. Quiz Auto-Generated Based on Object
Each detected object loads related quiz questions (up to 20).  
Examples:  
- Beaker → Lab safety, measurement  
- Microscope → Biology, handling procedures  
- Test tube → Chemistry safety  
- Flask → Heating rules, handling  

### 🎮 3. Gamified Quiz System
- MCQ quiz  
- Next / Previous navigation  
- Submit after answering all  
- Tracks correct & wrong answers  
- Shows score instantly  

### 📖 4. Answer Review Screen
- Shows correct answer ✔  
- Shows the student's answer ✖  
- Each answer includes a **short explanation**  
- Option to **save question to favourites**

### ⭐ 5. Library Screen
- View **Saved Questions**  
- View **Recently Scanned Objects**  
- Remove items from favourites  
- Clear recently scanned list  

### 💡 6. Help Screen
- Instructions  
- Project details  
- Navigation guide  

---

## 🏛 Tech Stack Used

### **Frontend**
- HTML  
- CSS  
- JavaScript  

### **Machine Learning**
- TensorFlow.js  
- MobileNet pre-trained model  

### **Object Scanning / Camera**
- WebRTC camera API  
- HTTPS / GitHub Pages required for camera access  

### **Local Storage**
- Saves:
  - Quiz progress  
  - Saved questions  
  - Recently scanned objects  
  - Past scores  

### **Hosting**
- GitHub Pages  

---

## 📂 Project Structure
