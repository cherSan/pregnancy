import {useQuery} from "@realm/react";
import { Page } from "../components/page.component"
import {MotherMood as MM} from "../realms/mother-mood.ts";
import {List} from "../components/list.component.tsx";

export const MotherMood = ({ props }: any) => {
    const data = useQuery(MM)
        .sorted('datetime', true);

    return (
        <Page
            title={'Настроение мамы'}
            mood={true}
            {...props}
        >
            {
                data.length
                    ? (
                        <List>
                            {
                                data.map((w) => (
                                    <List.Item
                                        title={w.datetime.toLocaleString()}
                                        extra={w.value.toString()}
                                    />
                                ))
                            }
                        </List>
                    )
                    : null
            }
        </Page>
    )
}