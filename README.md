# EMI Calculator

A sleek, responsive web application designed to help users calculate their Equated Monthly Installments (EMI) for various loans. This tool provides a quick and clear breakdown of monthly payments, total interest, and the total amount payable.

---

## 🚀 Features

* **Real-time Calculation:** Get instant results as you adjust loan parameters.
* **Interactive UI:** Includes a settings option to toggle preferences and rearrange UI components for a better user experience.
* **Responsive Design:** Fully optimized for desktops, tablets, and mobile devices.
* **Visual Data:** Clear breakdown of Principal vs. Interest amounts.

## 🛠️ Tech Stack

* **Frontend:** React.js / JavaScript
* **Styling:** SCSS / CSS3
* **State Management:** React Hooks
* **Build Tool:** Create React App

## 📊 The Formula

The application uses the standard EMI calculation formula:

$$E = P \cdot r \cdot \frac{(1 + r)^n}{(1 + r)^n - 1}$$

Where:
* **E** is the monthly payment (EMI).
* **P** is the Principal loan amount.
* **r** is the monthly interest rate (Annual rate / 12 / 100).
* **n** is the loan tenure in months.

---

## 📦 Installation & Setup

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/sudamchakor/emiCalculator.git](https://github.com/sudamchakor/emiCalculator.git)