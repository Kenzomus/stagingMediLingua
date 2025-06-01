{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.libgtk2.0-0
    pkgs.libgtk3.0
    pkgs.libnotify-dev
    pkgs.libgconf-2-4
    pkgs.libnss3
    pkgs.libxss1
    pkgs.libasound2
    pkgs.libxtst6
    pkgs.xauth
    pkgs.xvfb
  ];
  idx.extensions = [ 
    
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--hostname"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}