import React from "react";
import { Facebook, Instagram, Twitter, Star, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import "./App.css"; // Import CSS file
import logo from "./assets/logo.png";

export default function LandingPage() {
  return (
    <div className="landing-container">
      <img src={logo} alt="Logo" className="logo" />
      <motion.div className="landing-title">Swadika Foods</motion.div>
      <motion.div className="landing-caption">The Homemade Goodness</motion.div>

      <div className="button-grid">
        <motion.div whileHover={{ scale: 1.1 }}>
          <a href="https://example.com/place-order" target="_blank" rel="noopener noreferrer">
            <button className="button">
              <ShoppingCart /> Place an Order
            </button>
          </a>
        </motion.div>

        <br></br>

        <motion.div whileHover={{ scale: 1.1 }}>
          <a href="https://g.co/kgs/kKrJxRA" target="_blank" rel="noopener noreferrer">
            <button className="button">
              <Star /> Rate on Google
            </button>
          </a>
        </motion.div>

        <br></br>

        <motion.div whileHover={{ scale: 1.1 }}>
          <a href="https://facebook.com/example" target="_blank" rel="noopener noreferrer">
            <button className="button">
              <Facebook /> Facebook
            </button>
          </a>
        </motion.div>

        <br></br>

        <motion.div whileHover={{ scale: 1.1 }}>
          <a href="https://www.instagram.com/swadikafoods" target="_blank" rel="noopener noreferrer">
            <button className="button">
              <Instagram /> Instagram
            </button>
          </a>
        </motion.div>

        <br></br>

        <motion.div whileHover={{ scale: 1.1 }}>
          <a href="https://twitter.com/example" target="_blank" rel="noopener noreferrer">
            <button className="button">
              <Twitter /> Twitter
            </button>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
