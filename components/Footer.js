const Footer = () => {
  return (
    <footer className='card'>
      <div style={containerStyle}>
        <div className='text-center'>
          <p>&copy; {new Date().getFullYear()} Copyright: WordPapa</p>
        </div>
      </div>
    </footer>
  );
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 20px',
};

export default Footer;
