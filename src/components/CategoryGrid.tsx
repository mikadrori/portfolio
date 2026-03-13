import { CategoryCard } from './CategoryCard';

const CATEGORIES = [
  {
    label: "Design",
    color: "#E5E7EB", // gray-200
    image: "https://picsum.photos/seed/design/800/800"
  },
  {
    label: "Code",
    color: "#D1D5DB", // gray-300
    image: "https://picsum.photos/seed/code/800/800"
  },
  {
    label: "Motion",
    color: "#9CA3AF", // gray-400
    image: "https://picsum.photos/seed/motion/800/800"
  }
];

export const CategoryGrid = () => {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <CategoryCard 
            key={cat.label}
            label={cat.label}
            color={cat.color}
            image={cat.image}
          />
        ))}
      </div>
    </section>
  );
};
