export function loader({params}){
  return null;
}
export function action({request, params}){
  return null;
}



export default function LogoutPage() {
  return (<>
    <div id="timeout-page">
      <h2>Time out! ⏳🔐</h2>
      <h3>Still There?</h3>
      <i>It seems that you are not still there...</i>
    </div>
    </>);
}
