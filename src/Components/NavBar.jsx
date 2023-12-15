import React, { useContext } from 'react';
import { UserContext } from '../../Context/UserContext';
import { useFirestoreInteraction } from '../../FireBase/FirestoreInteraction';

const NavBar = () => {
    const { handleSignIn, handleSignOut } = useFirestoreInteraction();
    const { user, setUser } = useContext(UserContext);
    const isLoggedIn = user ? true : false;

    return (
        <div className='flex flex-row bg-gray-400 justify-between p-4'>
            <div>theudsbfsd</div>
            {isLoggedIn && <div>{user.displayName}</div>}
            {isLoggedIn && <div onClick={handleSignOut}>Logout</div>}
            {!isLoggedIn && <div onClick={handleSignIn}>Login</div>}
            
            
        </div>
    )
}
export default NavBar;