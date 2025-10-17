import React, { useState, useEffect } from "react";
import { DesktopIcon, Screen } from "../../types/interfaces";
import { PdfViewer } from "../PdfViewer";
import { Browser } from "../Browser";
import { Terminal } from "../Terminal";
import { ProjectViewer } from "../ProjectViewer";
import { Gallery } from "../Gallery";
import { Mail } from "../Mail";
import { Music } from "../Music";
import { FaBatteryFull, FaWifi } from "react-icons/fa";
import { MobileScreen } from "./MobileScreen";
import { MobileDock } from "./MobileDock";

interface IOSMobileViewProps {
  apps: DesktopIcon[];
}

export const IOSMobileView: React.FC<IOSMobileViewProps> = ({ apps }) => {
  const [screens, setScreens] = useState<Screen[]>([
    { id: "home", title: "Home", type: "home" },
  ]);
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 10);
    return () => clearInterval(timer);
  }, []);

  const openScreen = (
    type: "pdf" | "browser" | "terminal" | "projects" | "photos" | "mail" | "music" | "other",
    title: string,
    pdfPath?: string
  ) => {
    const newScreen: Screen = {
      id: `screen-${Date.now()}`,
      title,
      type,
      pdfPath,
      content:
        type === "pdf" && pdfPath ? (
          <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
            <PdfViewer pdfPath={pdfPath} />
          </div>
        ) : type === "browser" ? (
          <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
            <Browser />
          </div>
        ) : type === "terminal" ? (
          <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
            <Terminal />
          </div>
        ) : type === "projects" ? (
          <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
            <ProjectViewer />
          </div>
        ) : type === "photos" ? (
          <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
            <Gallery />
          </div>
        ) : type === "mail" ? (
          <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
            <Mail />
          </div>
        ) : type === "music" ? (
          <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
            <Music />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            {title} Content
          </div>
        ),
    };
    setScreens([...screens, newScreen]);
  };

  const goBack = () => {
    if (screens.length > 1) setScreens(screens.slice(0, -1));
  };

  const handleAppTap = (app: DesktopIcon) => {
    if (app.type === "pdf" && app.content)
      openScreen("pdf", app.name, app.content);
    else if (app.id === "finder") openScreen("other", "Files");
    else if (app.id === "projects") openScreen("projects", "Projects");
    else openScreen("other", app.name);
  };

  const currentScreen = screens[screens.length - 1];

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex flex-col overflow-hidden font-sans"
      style={{ backgroundImage: "url('./ios_wallpaper.jpg')" }}
    >
      {/* Status Bar */}
      <div className="flex justify-between items-center h-8 bg-transparent text-white px-4 text-xs pt-1">
        <div className="font-semibold">{currentTime}</div>
        <div className="flex items-center space-x-1.5">
          <FaWifi size={12} />
          <FaBatteryFull size={14} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <MobileScreen
          currentScreen={currentScreen}
          screens={screens}
          apps={apps}
          onAppTap={handleAppTap}
          onGoBack={goBack}
        />
      </div>

      {/* Mobile Dock */}
      {currentScreen.type === "home" && (
        <MobileDock onOpenScreen={openScreen} />
      )}
    </div>
  );
};
