# 📱 AR Quiz Trainer  
### *Scan Objects-Learn Smarter*

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
Each detected object loads related quiz questions (up to 5).  
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

## 🧠 How It Works (Flow)

1. User opens the website  
2. Allows camera access  
3. Points camera at any lab object  
4. AI Model (MobileNet) detects the object  
5. App loads questions related to the detected object  
6. User answers the quiz  
7. Score is calculated  
8. Explanation screen shows correct & wrong answers  
9. User can save questions to Favourites  
10. Recently scanned objects are stored  
11. User can view saved items in Library  

---

## 🖼 Screens Included

### 🏠 1. Home Screen
- Start Scan  
- Library  
- Help  

### 📷 2. Scan Screen
- Live camera feed  
- Object detection  
- “Not Recognized” message if detection fails  

### 📝 3. Quiz Screen
- Displays questions & options  
- Next / Previous buttons  
- Submit only at the end  
- Total ~20 MCQs  

### 📊 4. Score Screen
- Shows total score  
- Shows correct and wrong count  

### 🧾 5. Answer Review Screen
- Shows correct answer  
- Shows selected answer  
- Gives explanation  
- Save to Favourites button  

### 📚 6. Library Screen
- Favourites  
- Recently scanned  
- Remove options available  

### ❓ 7. Help Screen
- Detail  
- Instructions  
- Back  

---

## 🎯 Key Features Summary

- ✔ AI-driven object detection  
- ✔ Quiz auto-generated based on detected object  
- ✔ Scoring system  
- ✔ Answer review  
- ✔ Save favourite questions  
- ✔ Recently scanned object history  
- ✔ Remove items from favourites  
- ✔ Works offline after loading (no backend)  
- ✔ Fully browser-based  

---

## 🧪 Supported Lab Objects (Examples)
> *Project works with ANY object judges provide.*

Common detections:
- Beaker  
- Test Tube  
- Microscope  
- Flask  
- Measuring cylinder  
- Pipette  
- Lab tools (more general category)  

Even if the exact object is not in dataset → AI gives the **closest match** and loads related quiz.

---

## 💾 Local Storage Used For
- Saved questions  
- Recently scanned objects  
- User score history  
- Last scanned object  
- Favourites list  

No backend is needed.

---

## ▶️ Running the Project Locally

### **1. Using VS Code (Live Server)**
- Install **Live Server Extension**
- Right-click `index.html`
- Click **Open with Live Server**

### **2. Without VS Code**
Just open:
