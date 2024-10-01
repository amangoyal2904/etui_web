import SpotlightNavList from './SpotlightNavList';


const SpotlightNav = ({ sec }: any) => {
  
  return (
    <>
      {
        sec?.map((value, index) => <SpotlightNavList data={value} key={`SpotlightNav_${index}`}  />)
      }
    </>
  )
}

export default SpotlightNav;