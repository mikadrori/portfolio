import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface CategoryCardProps {
  label: string;
  color: string;
  image: string;
  className?: string;
  key?: string | number;
}

export const CategoryCard = ({ label, color, image, className }: CategoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        "relative aspect-square overflow-hidden cursor-pointer group",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background Color Layer */}
      <div 
        className="absolute inset-0 transition-colors duration-700 ease-out"
        style={{ backgroundColor: isHovered ? 'transparent' : color }}
      />

      {/* Image Layer */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <img 
              src={image} 
              alt={label}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Overlay for text readability if needed */}
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text Label */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <motion.span 
          className={cn(
            "text-2xl md:text-3xl font-bold uppercase tracking-widest transition-colors duration-500",
            isHovered ? "text-white" : "text-black"
          )}
          animate={{ 
            y: isHovered ? -10 : 0,
            opacity: isHovered ? 1 : 0.8
          }}
        >
          {label}
        </motion.span>
      </div>
    </motion.div>
  );
};
