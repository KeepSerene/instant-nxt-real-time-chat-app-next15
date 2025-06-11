import Image from "next/image";

function LoadingScreen({ size = 100 }: { size?: number }) {
  return (
    <div className="size-full flex justify-center items-center">
      <Image
        src="/logo.svg"
        alt="InstantNXT logo"
        width={size}
        height={size}
        className="animate-pulse duration-700"
      />

      <p className="sr-only">Loading...</p>
    </div>
  );
}

export default LoadingScreen;
