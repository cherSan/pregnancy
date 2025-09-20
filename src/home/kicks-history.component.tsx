import {useQuery} from "@realm/react";
import {Kick} from "../realms/kick.ts";
import {List} from "../components/list.component.tsx";

export const KicksHistory = () => {
    const kicks = useQuery(Kick).sorted('datetime', true);

    return (
        <List>
            {
                kicks.map((kick: Kick) => (
                    <List.Item
                        key={kick._id.toString()}
                        title={kick?.datetime?.toLocaleString()}
                        description={kick.comment}
                    />
                ))
            }
        </List>
    )
}