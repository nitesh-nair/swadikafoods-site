import React from "react";
import { Facebook, Instagram, Twitter, Star, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import "./App.css"; // Import CSS file
import logo from "./assets/swadika-logo.svg";

export default function LandingPage() {
  return (
    <main className="landing-container">
      <img src={logo} alt="Logo" className="logo" />

      <div className="button-grid">
        <motion.div whileHover={{ scale: 1.1 }}>
          <a href="https://www.swadikafoods.com/store" target="_blank" rel="noopener noreferrer">
            <button className="button">
              <ShoppingCart /> Place an Order
            </button>
          </a>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }}>
          <a href="https://g.co/kgs/kKrJxRA" target="_blank" rel="noopener noreferrer">
            <button className="button">
              <Star /> Rate on Google
            </button>
          </a>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }}>
          <a href="https://www.facebook.com/share/1D9etR2xJh/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
            <button className="button">
              <Facebook /> Facebook
            </button>
          </a>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }}>
          <a href="https://www.instagram.com/swadikafoods" target="_blank" rel="noopener noreferrer">
            <button className="button">
              <Instagram /> Instagram
            </button>
          </a>
        </motion.div>
      </div>
    </main>
  );
}
