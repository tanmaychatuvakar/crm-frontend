import { CardBodyProps, CardProps, CardTitleProps } from "./card.props";

export const Card: React.FC<CardProps> & {
  Title: React.FC<CardTitleProps>;
  Body: React.FC<CardBodyProps>;
} = ({ children, className }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className={`p-6 space-y-4 md:space-y-6 sm:p-8 ${className}`}>
        {children}
      </div>
    </div>
  );
};

const CardTitle: React.FC<CardTitleProps> = ({ children }) => {
  return (
    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
      {children}
    </h1>
  );
};

const CardBody: React.FC<CardBodyProps> = ({ children }) => <>{children}</>;

Card.Title = CardTitle;
Card.Body = CardBody;
