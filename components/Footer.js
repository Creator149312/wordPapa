
import { Card } from "@components/ui/card";

const Footer = () => {
  return (
    <Card className='w-full rounded-none border-t-2 mt-2 p-2'>
        <div className='text-center'>
          <p className="mb-2 text-lg font-semibold">&copy; {new Date().getFullYear()} Copyright: WordPapa</p>
        </div>
    </Card>
  );
};

export default Footer;
