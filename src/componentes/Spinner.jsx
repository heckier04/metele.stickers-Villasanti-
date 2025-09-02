import '../sass/spinner.scss';

const Spinner = ({ 
  type = 'default', 
  size = 'medium', 
  color = 'primary', 
  fullscreen = false,
  className = '' 
}) => {
  
  const getSpinnerClass = () => {
    let baseClass = '';
    
    switch (type) {
      case 'dots':
        baseClass = 'spinner-dots';
        break;
      case 'pulse':
        baseClass = 'spinner-pulse';
        break;
      case 'bars':
        baseClass = 'spinner-bars';
        break;
      case 'dual-ring':
        baseClass = 'spinner-dual-ring';
        break;
      default:
        baseClass = 'spinner';
        break;
    }
    
    // Agregar clases de tamaño y color solo para spinner clásico
    if (type === 'default') {
      if (size === 'small') baseClass += ' spinner--small';
      if (size === 'large') baseClass += ' spinner--large';
      baseClass += ` spinner--${color}`;
    }
    
    return `${baseClass} ${className}`;
  };

  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={getSpinnerClass()}>
            {[...Array(8)].map((_, i) => (
              <div key={i}></div>
            ))}
          </div>
        );
      
      case 'bars':
        return (
          <div className={getSpinnerClass()}>
            {[...Array(3)].map((_, i) => (
              <div key={i}></div>
            ))}
          </div>
        );
      
      default:
        return <div className={getSpinnerClass()}></div>;
    }
  };

  if (fullscreen) {
    return (
      <div className="spinner-container spinner-container--fullscreen">
        {renderSpinner()}
      </div>
    );
  }

  return (
    <div className="spinner-container">
      {renderSpinner()}
    </div>
  );
};

export default Spinner;