import MarketsBand from './MarketsBand';
import HeaderAuth from './HeaderAuth';
import HeaderNav from './HeaderNav';
import HeaderLogo from 'components/HeaderLogo';
import { json } from 'stream/consumers';

const Header = (props) => {
    console.log(props);
    return (
        <header>
            {/* <MarketsBand /> */}
            <HeaderLogo />
            <pre>{JSON.stringify(props.menuData, null, 2)}</pre>
            {/* <HeaderAuth />
            <HeaderNav /> */}
        </header>
    )
}

export default Header