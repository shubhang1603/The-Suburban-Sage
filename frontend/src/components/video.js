export default function Video()
{
    return(
        <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/city.mp4" type="video/mp4" />
      </video>
    )
}