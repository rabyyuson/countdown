import styled from 'styled-components'

const FooterContainer = styled.div`
  padding-top: 40px;
  margin: 0 auto;
  width: 150px;
  text-align: center;
`

const Link = styled.a`
  font-size: 12px;
  color: #505050;
  font-weight: bold;

  &:hover {
    color: #000000;
  }
`

const Footer = () => {
  const now = new Date()
  
  return (
    <FooterContainer>
      <Link href="https://rabyyuson.dev/">
        {now.getFullYear()}. Raby Yuson.
      </Link>
    </FooterContainer>
  )
}

export default Footer
