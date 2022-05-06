export const TwitterScriptHandler = () => {
    const script = document.createElement('script')
  
    return {
      initialize() {
        return new Promise(resolve => {
          script.src = 'https://platform.twitter.com/widgets.js'
          document.body.appendChild(script)
          script.setAttribute('data-testid', 'twitter-script')
          script.onload = () => resolve()
        })
      },
      cleanup() {
        document.body.removeChild(script)
      }
    }
  }