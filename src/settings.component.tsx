import {Card, DatePicker, Input, List, View, WhiteSpace, WingBlank} from "@ant-design/react-native";
import {useQuery, useRealm} from "@realm/react";
import {User} from "./realms/user.ts";
import {useCallback} from "react";

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
                user.dob = dob;
            });
        }
    }, [user, realm]);

    return (
        <View>
            <WhiteSpace />
            <WingBlank size="lg">
                <Card>
                    <Card.Header
                        title="Personal Data"
                    />
                    <Card.Body>
                        <Input
                            value={user.name}
                            onChange={e => {
                                onNameChange((e.target as any).value)
                            }}
                            placeholder={'User Name'}
                        />
                        <WhiteSpace />
                        <DatePicker
                            value={user.dob}
                            precision="day"
                            minDate={new Date(1980, 7, 6)}
                            maxDate={new Date(2000, 11, 3)}
                            onChange={onDOBChange}
                            format="YYYY-MM-DD"
                        >
                            <List.Item arrow="horizontal">DOB</List.Item>
                        </DatePicker>
                    </Card.Body>
                </Card>
            </WingBlank>

        </View>
    )
}