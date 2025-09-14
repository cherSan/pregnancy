import {Button, Card, Input, List, SwipeAction} from "@ant-design/react-native";
import {useNavigation} from "@react-navigation/native";
import {useMemo} from "react";

export const MedicationsStatistic = () => {
    const navigation = useNavigation();
    const medications = useMemo(() => {
        return [
            {
                name: 'CalSource',
                time: '9:00',
            },
            {
                name: 'FERli',
                time: '12:00',
            },
            {
                name: 'Obimin-AZ',
                time: '15:00',
            },
            {
                name: 'Clexane',
                time: '19:00',
                comments: true,
            },
            {
                name: 'FERli',
                time: '19:30',
            },
            {
                name: 'Asperin',
                time: '23:00',
            }
        ]
    }, []);

    return (
        <Card>
            <Card.Header
                title="Movement and Pushing"
            />
            <Card.Body>
                <List>
                    {
                        medications.map((med) => (
                            <SwipeAction
                                key={`${med.name}_${med.time}`}
                                right={[
                                    {
                                        text: 'Done',
                                        onPress: () => console.log('read'),
                                        backgroundColor: 'blue',
                                        color: 'white',
                                    },
                                ]}
                                closeOnAction
                                closeOnTouchOutside
                            >
                                <List.Item

                                    extra={med.time}
                                >
                                    {med?.name}
                                </List.Item>
                            </SwipeAction>
                        ))
                    }
                    <List.Item>
                        <Input placeholder={'Дополнительное лекарство'} />
                        <Input placeholder={'Комментарий'} />
                        <Button>Принять</Button>
                    </List.Item>
                </List>
            </Card.Body>
            <Card.Footer
                content={[
                    <Button
                        onPress={() => {
                            navigation.navigate('MedicationConfiguration')
                        }}
                    >
                        Настройка
                    </Button>,
                    <Button
                        onPress={() => {
                            navigation.navigate('Kicks')
                        }}
                    >
                        История
                    </Button>
                ]}
            />
        </Card>
    )
}