
import fashionImage from "../assets/icon/screenDisplay.png"

const AuthScreenLayout = ({ children }) => {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

      {/* LEFT PANEL */}
      <section
        className="relative min-h-[500px] bg-cover bg-center lg:min-h-screen"
        style={{ backgroundImage: `url(${fashionImage})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex h-full min-h-[500px] flex-col justify-between p-8 text-white sm:p-12 lg:min-h-screen lg:p-14">

          {/* Brand Logo */}
          <div>
            <h1 className="font-serif text-4xl tracking-[0.12em] sm:text-5xl">
              VELORA
            </h1>

            <p className="mt-2 flex items-center gap-3 text-xs tracking-[0.3em]">
              <span className="h-px w-8 bg-white" />
              ATELIER ADMIN
              <span className="h-px w-8 bg-white" />
            </p>
          </div>

          {/* Brand Description */}
          <div className="max-w-sm">
            <div className="mb-6 h-px w-20 bg-white" />

            <h2 className="font-serif text-3xl">
              Manage. Grow. <span className="italic">Inspire.</span>
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/85">
              Step into your admin panel
              <br />
              and take control of your store.
            </p>
          </div>

        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="flex min-h-[650px] items-center justify-center bg-[#FAF9F7] px-6 py-12 sm:px-10 lg:min-h-screen lg:px-12">

        <div className="w-full max-w-[540px]">
          {children}
        </div>

      </section>

    </main>
  );
};

export default AuthScreenLayout;
