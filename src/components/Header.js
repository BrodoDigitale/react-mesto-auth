import logo from '../images/Logo_mesto.svg'
export function Header() {
    return(
    <header className="header">
        <img className="header__logo" src={logo} alt="логотип Место" />
    </header>
    )
}