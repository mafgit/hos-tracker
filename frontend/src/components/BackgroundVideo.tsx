export default function BackgroundVideo() {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen z-10">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-10"
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      <div className="bg-black/80 backdrop-blur-[8px] absolute top-0 left-0 w-full h-full z-20"></div>
    </div>
  );
}
