import { useEffect } from 'react';
import { X} from 'lucide-react';

function Modal({ isOpen, onClose, title, children, footer, preventCloseOnOverlayClick = false }) {

    useEffect(() => {
        const handleKeyDown = (e) => {
        if (e.key === 'Escape' && isOpen) {onClose();}};

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
        
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (!preventCloseOnOverlayClick && e.target === e.currentTarget) {onClose();}
    }; 
    
    return ( 
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleOverlayClick} aria-modal="true" role="dialog">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()} >

                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">{title}</h3>
                    <button className="p-1 text-gray-400 transition-colors hover:text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200"
                        onClick={onClose} aria-label="Close modal">
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">{children}</div>
                {footer && (<div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-xl">{footer}</div>)}
            </div>
        </div> 
    );
}

export default Modal;