'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';

const steps = [
  { id: 'name', question: "What's your name?", sub: "Let's personalize your cosmic journey", placeholder: "Enter your full name", type: "text" },
  { id: 'dob', question: "Your birth date", sub: "When did your cosmic journey begin?", placeholder: "DD/MM/YYYY", type: "date" },
  { id: 'time', question: "Time of birth", sub: "For accurate planetary positions", placeholder: "--:-- --", type: "time" },
  { id: 'place', question: "Place of birth", sub: "Select your birth city", placeholder: "Search city...", type: "text" }
];

export default function InputFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', dob: '', time: '', place: '' });

  const handleSubmit = async () => {
    // 1. Generate a unique Lead ID
    const leadId = crypto.randomUUID(); 

    // 2. Track Lead (Fire and Forget)
    fetch('/api/track-order', {
        method: 'POST',
        body: JSON.stringify({
            leadId,
            name: formData.name,
            dob: formData.dob,
            time: formData.time,
            place: formData.place,
            // email/phone if you have them at this stage
        })
    });
  };
  const handleNext = () => {
    // Simple validation
    const val = Object.values(formData)[currentStep];
    if (!val) return; 

    if (currentStep < steps.length - 1) {
      setCurrentStep(c => c + 1);
    } else {
      // Encode data in URL to avoid database for now
      let params = new URLSearchParams(formData).toString();
      params += `&leadId=${crypto.randomUUID()}`; // Append Lead ID
      handleSubmit();
      router.push(`/teaser?${params}`);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-[#050511] p-6 flex flex-col relative">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-800 rounded-full mb-8 mt-4 overflow-hidden">
            <motion.div 
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / 4) * 100}%` }}
            />
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 mb-8 uppercase tracking-wider">
            <span>Step {currentStep + 1} of 4</span>
            <span>Almost there!</span>
        </div>

        <AnimatePresence mode='wait'>
            <motion.div
                key={currentStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="flex-1 flex flex-col justify-center"
            >
                <h2 className="text-3xl font-[family-name:var(--font-playfair)] text-white mb-2">{step.question}</h2>
                <p className="text-gray-400 mb-8">{step.sub}</p>

                <div className="relative group">
                    {step.id === 'dob' && <Calendar className="absolute left-4 top-4 text-gray-400" size={20} />}
                    {step.id === 'time' && <Clock className="absolute left-4 top-4 text-gray-400" size={20} />}
                    {step.id === 'place' && <MapPin className="absolute left-4 top-4 text-gray-400" size={20} />}
                    
                    <input
                        type={step.type}
                        className="w-full bg-[#101025] border-2 border-gray-700 focus:border-yellow-500 rounded-xl py-4 px-4 pl-12 text-lg text-white outline-none transition-colors"
                        placeholder={step.placeholder}
                        value={Object.values(formData)[currentStep]}
                        onChange={(e) => setFormData({...formData, [Object.keys(formData)[currentStep]]: e.target.value})}
                        autoFocus
                    />
                </div>
            </motion.div>
        </AnimatePresence>

        <button 
            onClick={handleNext}
            className="w-full glow-btn py-4 rounded-xl text-lg mt-auto mb-4"
        >
            {currentStep === 3 ? "Get My Free Teaser >" : "Next Step"}
        </button>
    </div>
  );
}