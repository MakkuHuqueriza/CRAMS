import React from 'react'

const navbar = () => {
  return (
    <>
        <nav className="bg-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <a href="/" className="text-secondary-foreground">
                            Logo
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </>
  );
};

export default navbar;
