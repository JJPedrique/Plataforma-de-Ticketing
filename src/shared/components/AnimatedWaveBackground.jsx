const AnimatedWaveBackground = ({children}) => {
  return (
    <>
    <div className="fixed top-1/2 left-1/2 w-full h-full">
      <style>
        {`
          .wave-pattern,
          .before-wave-pattern::before {
            background-color: #fffadb;
            background-image: 
              url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='198'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='-10.959%25' y2='100%25'%3e%3cstop stop-color='%23fcc900' stop-opacity='.25' offset='0%25'/%3e%3cstop stop-color='%23fcc900' offset='100%25'/%3e%3c/linearGradient%3e%3c/defs%3e%3cpath fill='url(%23a)' fill-rule='evenodd' d='M.005 121C311 121 409.898-.25 811 0c400 0 500 121 789 121v77H0s.005-48 .005-77z'/%3e%3c/svg%3e"),
              url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='198'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='-10.959%25' y2='100%25'%3e%3cstop stop-color='%23fcc900' stop-opacity='.25' offset='0%25'/%3e%3cstop stop-color='%23fcc900' offset='100%25'/%3e%3c/linearGradient%3e%3c/defs%3e%3cpath fill='url(%23a)' fill-rule='evenodd' d='M.005 121C311 121 409.898-.25 811 0c400 0 500 121 789 121v77H0s.005-48 .005-77z'/%3e%3c/svg%3e"),
              url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='198'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='-10.959%25' y2='100%25'%3e%3cstop stop-color='%23fcc900' stop-opacity='.25' offset='0%25'/%3e%3cstop stop-color='%23fcc900' offset='100%25'/%3e%3c/linearGradient%3e%3c/defs%3e%3cpath fill='url(%23a)' fill-rule='evenodd' d='M.005 121C311 121 409.898-.25 811 0c400 0 500 121 789 121v77H0s.005-48 .005-77z'/%3e%3c/svg%3e");
            background-repeat: repeat-x;
            background-size: 1600px 50%;
            background-position: 0 130%, -50px 130%, 500px 130%;
            animation: 60s waves linear infinite forwards;
          }

          @keyframes waves {
            to {background-position: 1600px 130%, 3150px 130%, 5300px 130%;}
          }
        `}
      </style>

      {/* Contenedor principal (.box) */}
      <div 
        className="
          before:absolute before:content-[''] 
          before:w-full before:h-full
          before:-translate-x-1/2 before:-translate-y-1/2 
          before:blur-0 before:opacity-100 
          before:transition-all before:duration-450 before:ease-[cubic-bezier(0.23,1,0.32,1)]
        
          before-wave-pattern
        "
      >
        {/* Contenedor interno (.box-inner) */}
        <div className="relative w-full h-full wave-pattern"/>
      </div>

    </div>
     <div className="relative z-0 min-h-dvh flex flex-col">
        {children}
      </div>
    </>
  );
};

export default AnimatedWaveBackground;