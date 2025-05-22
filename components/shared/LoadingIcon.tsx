import Image from "next/image";

function LoadingIcon({ size = 100 }: { size?: number }) {
  return (
    <div className="size-full flex justify-center items-center">
      <Image
        src="/logo.svg"
        alt="Loading icon"
        width={size}
        height={size}
        className="animate-pulse duration-700"
      />
    </div>
  );
}

export default LoadingIcon;
