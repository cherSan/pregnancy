import {useQuery, useRealm} from "@realm/react";
import {FC, ReactNode, useEffect, useState} from "react";
import {BSON} from "realm";
import {User} from "./realms/user.ts";

type Props = {
    children: ReactNode;
}

export const Initialize: FC<Props> = ({ children }) => {
    const realm = useRealm();
    const users = useQuery(User);

    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const user = users[0];
        if (!user) {
            realm.write(() => {
                realm.create<User>(
                    'User',
                    {
                        _id: new BSON.ObjectId(),
                        name: ''
                    }
                );
            });
        }

        setInitialized(true)
    }, [users, realm, setInitialized]);

    return initialized ? children : null;
}