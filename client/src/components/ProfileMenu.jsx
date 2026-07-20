import { ChevronDown, LogIn, LogOut, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function getInitials(name) {
  return [...(name || "SSJ")].slice(0, 2).join("");
}

export function ProfileMenu({ user, onProfile, onLogin, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function closeMenu(event) {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", closeMenu);
    return () => document.removeEventListener("pointerdown", closeMenu);
  }, []);

  if (!user) {
    return (
      <button className="header-login-button" type="button" onClick={onLogin}>
        <LogIn size={17} />
        로그인
      </button>
    );
  }

  return (
    <div className="profile-menu-wrap" ref={menuRef}>
      <button className="profile-button" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <span className="profile-avatar">{getInitials(user.name)}</span>
        <span className="profile-copy">
          <strong>{user.name}</strong>
          <small>관리자</small>
        </span>
        <ChevronDown size={15} />
      </button>
      {open ? (
        <div className="profile-dropdown">
          <button type="button" onClick={onProfile}><UserRound size={15} /> 내 정보</button>
          <button type="button" onClick={onLogout}><LogOut size={15} /> 로그아웃</button>
        </div>
      ) : null}
    </div>
  );
}
