import { motion } from "framer-motion";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export function AlertModal({ isOpen, onClose, message }: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center"
      style={{ position: "fixed", zIndex: 9999 }}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-[400px] relative"
      >
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-purple-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <p className="text-gray-700 font-medium">{message}</p>
          <button
            onClick={onClose}
            className="w-full bg-purple-600 text-white font-medium py-2 rounded-xl hover:bg-purple-700 transition-colors"
          >
            확인
          </button>
        </div>
      </motion.div>
    </div>
  );
}
