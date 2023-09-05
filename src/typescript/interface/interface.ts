// 全局配置
export interface globalConfig {
    apiUrl
    staticUrl
    clientUrl
    userUrl
    port
}

export interface anyObject {
    [key: string]: any
}

export interface onlyIdFace extends anyObject {
    id: string
}
// track
export interface trackInterface extends anyObject {
    track_id?: string,
    anonymous_id: string,
    user_id: string,
    system_id: string,
    url?: string,
    title?: string,
    referrer?: string,
    event_name?: string,
    type?: string,
    other_fields?: string,
}

// userinfo
export interface userInterface extends anyObject {
    id?: string,
    user_id: string,
    system_id: string,
    other_fields?: string,
}

export interface categoryFace extends anyObject {
    name: string,
    id: string,
}
export interface contentFace extends anyObject {
    content: string,
    id: string,
}
export interface articleFace extends anyObject {
    id: string,
    title: string,
    description: string,
    category_id: string,
    content: string,
}
