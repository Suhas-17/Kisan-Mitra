import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import "./Header.css";

function HeaderOptions({ hide }) {
  const { t } = useTranslation();
  function setLang(lng) {
    localStorage.setItem("lang", lng);
    document.location.reload(true);
  }
  return (
    <div className={`header__options ${hide && "header__optionsHide"}`}>
      <select
        className="header__option"
        value={localStorage.getItem("lang") || "en"}
        onChange={(e) => setLang(e.target.value)}
      >
        <option value="en">English - EN</option>
        <option value="kn">ಕನ್ನಡ - KN</option>
      </select>
      <Link to="/info" className="header__option">
        {t("Schemes")}
      </Link>
      <Link to="/marketPrice" className="header__option">
        {t("Market Price")}
      </Link>
      <Link to="/predict" className="header__option">
        {t("Predict")}
      </Link>
      <Link to="/account" className="header__option">
        {t("Account")}
      </Link>
      <Link to="/cart" className="header__option bottom__option">
        {t("Cart")}
      </Link>
    </div>
  );
}

function HeaderSearch({ outer, query }) {
  const [searchText, setSearchText] = useState(query);
  const navigate = useNavigate();

  return (
    <div className={`header__search ${outer ? "outer" : "inner"}`}>
      <input
        className="header__searchInput"
        // type="text"
        // name="val"
        // placeholder={query}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyPress={(e) =>
          e.key === "Enter" &&
          searchText.length !== 0 &&
          navigate(`/search?query=${searchText}`)
        }
      />
      <FiSearch
        size="1.5em"
        className="header__searchIcon"
        onClick={(e) =>
          searchText.length !== 0 && navigate(`/search?query=${searchText}`)
        }
      />
    </div>
  );
}

function Header({ query = "" }) {
  const [options, setOptions] = useState(true);
  const { t } = useTranslation();
  return (
    <nav className="header">
      <div className="header__main">
        <Link to="/" className="header__logo">
          {t("Kisan Mitra")}
        </Link>

        <HeaderSearch outer={false} query={query} />

        <HeaderOptions hide={options} />

        {options ? (
          <GiHamburgerMenu
            onClick={(e) => setOptions(false)}
            className="menu"
            size="1.5em"
          />
        ) : (
          <ImCross
            onClick={(e) => setOptions(true)}
            className="menu"
            size="1.5em"
          />
        )}
      </div>

      <HeaderSearch outer={true} query={query} />
    </nav>
  );
}

export default Header;
