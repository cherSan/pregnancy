import {Button, Card, Input, List, Switch, WhiteSpace, WingBlank} from "@ant-design/react-native";
import {useQuery} from "@realm/react";
import {MedicationConfiguration as MCC} from "../realms/medication-configuration.ts";
import {ScrollView} from "react-native";
import {useCallback} from "react";

export const MedicationConfiguration = () => {
    const medicationConfiguration = useQuery(MCC).sorted([
        ["planingTimeHours", false],
        ["planingTimeMinutes", false],
    ]);

    const onCreate = useCallback(() => {
        console.log(11)
    }, [])

    return (
        <WingBlank size="lg">
            <Card>
                <Card.Header
                    title="Movement and Pushing"
                />
                <Card.Body>
                    <List>
                        <List.Item>
                            <Input placeholder={'Лекарство'} />
                        </List.Item>
                        <List.Item>
                            <Input placeholder={'Часы'} />
                            <Input placeholder={'Минуты'} />
                        </List.Item>
                        <List.Item
                            extra={<Switch />}
                        >
                            Доступны комментарии
                        </List.Item>
                        <List.Item>
                            <Button
                                onPress={onCreate}
                            >
                                Принять
                            </Button>
                        </List.Item>
                    </List>
                </Card.Body>
            </Card>
            <WhiteSpace />
            <ScrollView>
                <Card>
                    <Card.Body>
                        <List>
                            {
                                !medicationConfiguration?.length
                                    ? <List.Item>No Data</List.Item>
                                    :  medicationConfiguration.map((mconfig) => (
                                        <List.Item
                                            key={`${mconfig.name}_${mconfig.planingTimeHours}:${mconfig.planingTimeMinutes}`}
                                            extra={`${mconfig.planingTimeHours}:${mconfig.planingTimeMinutes}`}
                                        >
                                            {mconfig.name}
                                        </List.Item>
                                    ))
                            }
                        </List>
                    </Card.Body>
                </Card>
            </ScrollView>
        </WingBlank>
    )
}