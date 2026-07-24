interface HorizontalScrollerProps {
  images: string[];
}

const HorizontalScroller = ({ images }: HorizontalScrollerProps) => {
  // Duplicate the list so the loop is seamless
  const looped = [...images, ...images];

  return (
    <div className="overflow-hidden w-full">
      <div className="flex gap-4 animate-marquee w-max">
        {looped.map((img, index) => (
          <img
            key={index}
            src={img}
            alt=""
            className="w-56 h-36 object-cover rounded-xl shrink-0"
          />
        ))}
      </div>
    </div>
  );
};

export default HorizontalScroller;