import Biography from 'features/coaches/Biography';
import ProfileHeader from 'features/coaches/ProfileHeader';

const BasicPage = ({
  name,
  profileImage,
  welcomeMessage,
  biography,
}: {
  name: string;
  profileImage: string;
  welcomeMessage: any;
  biography: any;
}) => (
  <>
    <ProfileHeader
      name={name as string}
      profileImage={profileImage}
      welcomeMessage={welcomeMessage}
    />
    <br />
    <Biography biography={biography} />
  </>
);

export default BasicPage;
