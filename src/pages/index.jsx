import Layout from "./Layout.jsx";

import Home from "./Home";

import Shop from "./Shop";

import Checkout from "./Checkout";

import Gallery from "./Gallery";

import Reviews from "./Reviews";

import About from "./About";

import Contact from "./Contact";

import PaymentSuccess from "./PaymentSuccess";

import PaymentCancel from "./PaymentCancel";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Shop: Shop,
    
    Checkout: Checkout,
    
    Gallery: Gallery,
    
    Reviews: Reviews,
    
    About: About,
    
    Contact: Contact,
    
    PaymentSuccess: PaymentSuccess,
    
    PaymentCancel: PaymentCancel,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Shop" element={<Shop />} />
                
                <Route path="/Checkout" element={<Checkout />} />
                
                <Route path="/Gallery" element={<Gallery />} />
                
                <Route path="/Reviews" element={<Reviews />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
                
                <Route path="/PaymentCancel" element={<PaymentCancel />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}