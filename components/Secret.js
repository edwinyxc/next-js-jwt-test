export default ({ username, loginToken, ...props }) => {
  const isloginTokenValid = token => token && token.endsWith('_OK')
  return (
    <>
      {
        isloginTokenValid 
        ? 
          <section>
            <p> 
              <h1> Personal Info </h1>
            </p>
            <div>
              <h1> {username} </h1> 
              <h1> {loginToken} </h1>
              <pre> {JSON.stringify(props, '\t')} </pre>
            </div>
          </section>
        : 
          <span> login first  </span>
      }
    </>
  )
}

