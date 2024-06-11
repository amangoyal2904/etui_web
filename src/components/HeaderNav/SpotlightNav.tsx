import SpotlightNavList from './SpotlightNavList';


const SpotlightNav = ({ sec }: any) => {
  console.log("Spotlight sec", sec);
  return (
    <>
      {
        sec?.map((value, index) => <SpotlightNavList data={value} />)
      }
    </>
  )
}

export default SpotlightNav;