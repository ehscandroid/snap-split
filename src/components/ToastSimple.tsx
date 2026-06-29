import { useState, useEffect } from "react";
import { useStateStore } from 'mgsmu-react'

const MESSAGES = [
    "Something happened!",
    "Action completed successfully 🎉",
    "Oops, something went wrong!",
    "Data saved successfully ✔️",
    "New update available 🚀",
    "Request processed!"
];

const ToastSimple = () => {

    const [toastEdit, _, removeReq] = useStateStore('toastEdit');
    const [message, setMessage] = useState("");
    const [visible, setVisible] = useState(false);


    useEffect(() => {
        if (toastEdit?.open) {
        console.log('ToastEdit changed:', toastEdit);
        removeReq('toastEdit');
        const random = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        setMessage(random);
        setVisible(true);

        setTimeout(() => {
            setVisible(false);
        }, 2500);
        }
    }, [toastEdit])

    return (
        <>

            {visible && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-gray-900 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
                        {message}
                    </div>
                </div>
            )}
        </>
    );
}

export default ToastSimple;