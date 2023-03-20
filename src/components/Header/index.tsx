import HeaderLogo from "components/HeaderLogo";
import HeaderNav from "components/HeaderNav";

interface PageProps {
  page: string;
  subsecnames: any;
  menuData: any;
}

const Header = (props) => {
const { page, menuData, subsecnames } = props;
  return (
    <header>
      <HeaderLogo page={page} subsecnames={subsecnames} />
      <HeaderNav menuData={menuData} subsecnames={subsecnames}/>
      <pre>{JSON.stringify(props.menuData, null, 2)}</pre>
    </header>
  )
}

export default Header