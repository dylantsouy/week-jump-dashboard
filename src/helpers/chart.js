import predictManImage from '@/assets/icons/predictMan.svg'; 

export const mainChart = (data) => {
    let redData = [];
    let greenData = [];
    data?.forEach((item) => {
        if (item?.Stage === '1') {
            redData.push([item.days, item.Pred]);
        }
        if (item?.Stage === '2') {
            greenData.push([item.days, item.Pred]);
        }
    });

    return {
        title: {
            text: '脫離呼吸器時機預測',
            left: 'lefy',
            textStyle: {
                fontSize: 16,
                color: '#384094',
            },
        },
        tooltip: {
            formatter: function (params) {
                return `${params.value[0]} Day`;
            },
        },
        xAxis: {
            min: 0,
            max: 30,
            type: 'value',
            interval: 1,
            axisLabel: {
                formatter: function (value) {
                    return `${value}`;
                },
            },
            offset: 20,
            name: 'Day',
            nameLocation: 'end',
        },
        yAxis: {
            min: 0,
            max: 100,
            interval: 10,
            axisLabel: {
                formatter: function (value) {
                    return `${value} %`;
                },
            },
        },
        grid: {
            top: '45px',
            right: '50px',
            left: '50px',
            bottom: '50px',
        },
        series: [
            {
                name: 'r',
                symbolSize: 42.5,
                data: redData,
                type: 'scatter',
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: '#ffe4d5',
                            },
                            {
                                offset: 1,
                                color: '#ffe4d5',
                            },
                        ],
                    },
                    global: false,
                },
                label: {
                    color: '#333',
                    show: true,
                    formatter: function (params) {
                        return `${params.value[1]} %`;
                    },
                    offset: [0, 2],
                    fontSize: 10,
                },
            },
            {
                name: 'g',
                symbolSize: 42.5,
                data: greenData,
                type: 'scatter',
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: '#bffacb',
                            },
                            {
                                offset: 1,
                                color: '#bffacb',
                            },
                        ],
                    },
                    global: false,
                },
                label: {
                    color: '#333',
                    show: true,
                    formatter: function (params) {
                        return `${params.value[1]} %`;
                    },
                    offset: [0, 2],
                    fontSize: 10,
                },
            },
        ],
    };
};
export const predictChart = (color, result) => {
    return {
        title: [
            {
                text: result ? `${result} %` : '無資料',
                bottom: 80,
                left: 'center',
                textStyle: {
                    fontSize: 22,
                    color: '#333',
                },
            },
        ],
        graphic: {
            elements: [
                {
                    type: 'image',
                    style: {
                        image:predictManImage,
                        width: 70,
                        height: 90,
                    },
                    bottom: 120,
                    left: 'center',
                },
            ],
        },
        series: [
            {
                color: [color, '#ececec'],
                name: 'Access From',
                type: 'pie',
                radius: ['60%', '70%'],
                data: [
                    { value: result, name: 'Search Engine' },
                    { value: 100 - result, name: 'Direct' },
                ],
                label: {
                    show: false,
                },
            },
        ],
    };
};
