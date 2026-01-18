import { Outlet } from "react-router-dom";
import Header from "./HeaderUser";
import Footer from "./FooterUser";
import Nav from "./Nav";
import Chatbot from "./Chatbot";


function LayoutUser() {
    return (
        <>
            <Header />
            <Nav />
            <Outlet />
            <Footer />
            <Chatbot />
        </>
    )
}

export default LayoutUser;