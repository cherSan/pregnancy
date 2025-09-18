import {useQuery, useRealm} from "@realm/react";
import {User} from "../realms/user.ts";
import {useCallback} from "react";
import {ScrollView} from "../components/scroll-view.component.tsx";
import {List} from "../components/list.component.tsx";
import {DatePicker, Input} from "@ant-design/react-native";

export const Settings = () => {
    const realm = useRealm()

    const users = useQuery(User);

    const user = users[0];

    const onNameChange = useCallback((name: string) => {
        if (user) {
            realm.write(() => {
                user.name = name;
            });
        }
    }, [user, realm]);

    const onDOBChange = useCallback((dob: Date) => {
        if (user) {
            realm.write(() => {
                dob.setHours(0,0,0,0)
                user.dob = dob;
            });
        }
    }, [user, realm]);

    const onEDDChange = useCallback((eddate: Date) => {
        if (user) {
            realm.write(() => {
                eddate.setHours(0,0,0,0)
                user.eddate = eddate;
            });
        }
    }, [user, realm]);

    return (
        <ScrollView>
            <List>
                <List.Item>
                    <Input
                        value={user.name}
                        onChangeText={onNameChange}
                        placeholder={'User Name'}
                    />
                </List.Item>
                <DatePicker
                    value={user.dob}
                    precision="day"
                    minDate={new Date(1980, 7, 6)}
                    maxDate={new Date(2000, 11, 3)}
                    onChange={onDOBChange}
                    format="YYYY-MM-DD"
                >
                    <List.Item arrow="horizontal">Дата рождения</List.Item>
                </DatePicker>
                <DatePicker
                    value={user.eddate}
                    precision="day"
                    minDate={new Date()}
                    maxDate={new Date(2100, 11, 3)}
                    onChange={onEDDChange}
                    format="YYYY-MM-DD"
                >
                    <List.Item arrow="horizontal">EDD</List.Item>
                </DatePicker>
            </List>
        </ScrollView>
    )
}