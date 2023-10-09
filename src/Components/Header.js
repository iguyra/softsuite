import SearchArea from "./SearchArea";
import SiteLogo from "./SiteLogo";
import UserDetails from "./UserDetails";

function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <SiteLogo />

        <SearchArea />

        <UserDetails />
      </div>
    </header>
  );
}

export default Header;
